import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
  Param,
} from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ConversationsService } from './conversations.service';

@Controller('conversations')
export class ConversationsController {
  constructor(private readonly conversationsService: ConversationsService) {}

  // Create a Message
  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createMessageDto: CreateMessageDto, @Request() req: any) {
    return this.conversationsService.create(createMessageDto, req.user.id);
  }

  // Get All user Conversations
  @Get(':id')
  findAllUserConversation(@Param('id') id: string) {
    return this.conversationsService.findAllUserConversation(+id);
  }
}
