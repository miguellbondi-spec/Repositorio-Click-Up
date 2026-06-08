import { Module } from '@nestjs/common';
import { OkrService } from './okr.service';
import { OkrController } from './okr.controller';

@Module({ providers: [OkrService], controllers: [OkrController] })
export class OkrModule {}
