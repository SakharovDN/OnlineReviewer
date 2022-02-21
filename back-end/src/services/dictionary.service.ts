import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

@Injectable()
export class DictionaryService {
  async GetWords(user, repository) {
    if (user) return await repository.find({ user });
    else return await repository.find();
  }

  async AddWord(dto, repository, user) {
    const { value, comment } = dto;
    try {
      if (user) await repository.save({ value, comment, user });
      else await repository.save({ value, comment });
    } catch (ex) {
      if (
        ex.constraint == 'WordExistsException' ||
        ex.constraint == 'OwnWordExistsException'
      )
        throw new ConflictException('This word is already exists');
      else throw new InternalServerErrorException();
    }
  }

  async EditWord(dto, repository): Promise<any> {
    const { id, value, comment } = dto;
    try {
      await repository.update(id, { value, comment });
    } catch (ex) {
      if (ex.constraint == 'WordExistsException')
        throw new ConflictException('This word is already exists');
      else {
        throw new InternalServerErrorException();
      }
    }
  }

  async DeleteWord(id, repository) {
    repository.delete(id);
  }
}
