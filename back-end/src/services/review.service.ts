import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import { TokenService } from './token.service';
import { ReviewEvent } from 'src/models/review-event.model';
const zip = require('express-zip');

@Injectable()
export class ReviewService {
  readonly CONSOLE_REVIEWER_PATH = '../console_reviewer/Reviewer';
  readonly UPLOADS_PATH = '../uploads/';

  constructor(
    @InjectRepository(ReviewEvent)
    private reviewEventRepository: Repository<ReviewEvent>,
    private tokenService: TokenService,
  ) {}

  async Review(dto, docs, auth): Promise<any> {
    if (
      (dto.useGlobalDictionary != 'true' &&
        dto.useGlobalDictionary != 'false') ||
      (dto.useOwnDictionary != 'true' && dto.useOwnDictionary != 'false')
    ) {
      throw new BadRequestException('Value is not boolean');
    }
    if (auth) {
      const token = auth.split(' ')[1];
      try {
        var user = this.tokenService.GetUserByAccessToken(token);
      } catch {
        throw new UnauthorizedException('You need authorization');
      }
    }

    let reviewResult = [];
    let filenames: string[] = [];
    let originalnames: string[] = [];

    docs.forEach((doc) => {
      const review = spawnSync(this.CONSOLE_REVIEWER_PATH, [
        path.resolve(`${this.UPLOADS_PATH}${doc.filename}`),
        dto.useGlobalDictionary,
        dto.useOwnDictionary,
        user ? user.id : '',
      ]);

      if (review.error || review.stderr.toString()) {
        docs.forEach((doc) => {
          fs.unlink(`${this.UPLOADS_PATH}${doc.filename}`, () => {});
        });
        throw new UnprocessableEntityException('Something went wrong');
      }

      reviewResult.push({
        originalname: doc.originalname,
        mistakesAmount: parseInt(review.stdout.toString()),
        err: review.stderr.toString(),
      });

      filenames.push(doc.filename);
      originalnames.push(doc.originalname);
    });
    this.WriteReviewEvent(user.email);
    return {
      link: `localhost:3000/home/getdocs/${filenames}/${originalnames}`,
      reviewResult,
    };
  }

  async GetDoc(dto, res) {
    let filenames = dto.filenames.split(',');
    let originalnames = dto.originalnames.split(',');
    let files = [];

    for (let i = 0; i < filenames.length; i++) {
      files.push({
        path: `${this.UPLOADS_PATH}${filenames[i]}`,
        name: `reviewed${originalnames[i]}`,
      });
    }
    console.log(files);
    res.zip(files, function (err) {
      if (err) res.status(404).json({ message: 'File not found!' });
      else {
        // todo: сделать сервис для удаления файлов
        files.forEach((file) => {
          fs.unlink(file.path, () => {});
        });
      }
    });
  }

  private async WriteReviewEvent(email) {
    this.reviewEventRepository.save({
      email: email,
      timestamp: new Date(),
    });
  }
}
