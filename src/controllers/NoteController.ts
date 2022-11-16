import { Controller, Request, UseGuards, Param, Post, Body, Get, Query, Patch, Delete } from '@nestjs/common';

import { JwtAuthGuard } from '../guards/JwtAuthGuard';
import { NoteService } from '../services/NoteService';
import { NoteValidator } from '../validators/NoteValidator';

@Controller('note')
export class NoteController {
  constructor(private readonly noteService: NoteService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':accountId')
  async createNote(@Request() req, @Param('sessionId') sessionId, @Body() data: NoteValidator) {
    const accountId = req.user._id;
    const { coordinates, text } = data;

    return await this.noteService.create({
      text,
      accountId,
      point: {
        type: 'Point',
        coordinates: [coordinates.longitude, coordinates.latitude],
      },
    });
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async editNote(@Request() req, @Param('id') id, @Body() data: NoteValidator) {
    const { text } = data;

    return await this.noteService.update(id, {
      text,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(@Request() req, @Param('id') id) {
    return await this.noteService.delete(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/')
  async findNearby(
    @Request() req,
    @Query('latitude') latitude,
    @Query('latitudeDelta') latitudeDelta,
    @Query('longitude') longitude,
    @Query('longitudeDelta') longitudeDelta,
  ) {
    const accountId = req.user._id;

    return await this.noteService.getNotesByRegion(
      {
        latitude: parseFloat(latitude),
        latitudeDelta: parseFloat(latitudeDelta),
        longitude: parseFloat(longitude),
        longitudeDelta: parseFloat(longitudeDelta),
      },
      accountId,
    );
  }
}
