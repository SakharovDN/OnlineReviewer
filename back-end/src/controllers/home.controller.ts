import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ReviewService } from 'src/services/review.service';

@Controller('home')
export class HomeController {
  constructor(private reviewService: ReviewService) {}

  @Post('review')
  @UseInterceptors(FilesInterceptor('docs', 5, { dest: '../uploads' }))
  Review(@Req() { headers }, @UploadedFiles() docs, @Body() dto) {
    return this.reviewService.Review(dto, docs, headers.authorization);
  }

  @Get('getdocs/:filenames/:originalnames')
  getFile(@Param() dto, @Res() res) {
    this.reviewService.GetDoc(dto, res);
  }
}
