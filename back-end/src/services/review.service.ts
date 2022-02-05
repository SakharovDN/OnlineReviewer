import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/models/user.model';
import { Repository } from 'typeorm';
import { spawnSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class ReviewService {
  readonly CONSOLE_REVIEWER_PATH = '../Reviewer/Reviewer';
  readonly UPLOADS_PATH = '../uploads/';

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async Review(dto, docs): Promise<any> {
    if (
      (dto.useGlobalDictionary != 'true' &&
        dto.useGlobalDictionary != 'false') ||
      (dto.useOwnDictionary != 'true' && dto.useOwnDictionary != 'false')
    ) {
      throw new BadRequestException('Value is not boolean');
    }
    // todo: достать userid для поиска своего словаря
    const ownDictionaryPath = '';

    let reviewResult = [];
    let filenames: string[] = [];
    let originalnames: string[] = [];

    docs.forEach((doc) => {
      const review = spawnSync(this.CONSOLE_REVIEWER_PATH, [
        path.resolve(`${this.UPLOADS_PATH}${doc.filename}`),
        dto.useGlobalDictionary,
        dto.useOwnDictionary,
        ownDictionaryPath,
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

    return {
      link: `localhost:3000/home/getdocs/${filenames}/${originalnames}`,
      reviewResult,
    };
  }

  async GetDoc(dto, res) {
    var zip = require('express-zip');
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
        files.forEach((file) => {
          fs.unlink(file.path, () => {});
        });
      }
    });
  }
}
