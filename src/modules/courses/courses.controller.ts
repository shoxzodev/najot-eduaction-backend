import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { ApiBearerAuth, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { CourseLevel, Role } from '@prisma/client';
import { Roles } from 'src/common/decorators/role';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { CreateCourseDto } from './dto/create.dto';
import { UpdateCourseDto } from './dto/update.dto';

@ApiBearerAuth()
@Controller('courses')
export class CoursesController {
    constructor(private readonly courseService: CoursesService) { }

    @ApiOperation({
        summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get()
    getAllCourses() {
        return this.courseService.getAllCourses()
    }

    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get("archive")
    getArchiveCourses(){
        return this.courseService.getArchiveCourses()
    }

    @ApiOperation({
        summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Get("one/:id")
    getOneCourse(@Param("id", ParseIntPipe) id: number) {
        return this.courseService.getOneCourse(id);
    }

    @ApiOperation({
        summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    // @ApiQuery({name:"level",enum:CourseLevel})
    @Post()
    createCourse(
        @Body() payload: CreateCourseDto,
        // @Query("level") level : GetCoursesDto
    ) {
        return this.courseService.createCourse(payload)
    }

    @ApiOperation({
        summary:`${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard,RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Delete("/:id")
    deleteCourse(@Param("id", ParseIntPipe) id: number){
        return this.courseService.deleteCourse(id)
    }

    @ApiOperation({ summary: `${Role.SUPERADMIN}, ${Role.ADMIN}` })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.SUPERADMIN, Role.ADMIN)
    @Patch("/:id")
    updateCourse(
        @Param("id", ParseIntPipe) id: number,
        @Body() payload: UpdateCourseDto
    ) {
        return this.courseService.updateCourse(id, payload)
    }
}
