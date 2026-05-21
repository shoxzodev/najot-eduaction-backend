import { Controller, Get, Param, ParseIntPipe, Post, Query, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { FilesService } from "./files.service";
import { diskStorage } from "multer";
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from "@nestjs/swagger";
import { Role } from "@prisma/client";
import { AuthGuard } from "src/common/guards/jwt-auth.guard";
import { RolesGuard } from "src/common/guards/role.guard";
import { Roles } from "src/common/decorators/role";

@Controller("files")
@ApiBearerAuth() 
export class FilesController {
    constructor(private readonly filesService: FilesService) { }

    @ApiOperation({
        summary: `${Role.ADMIN}, ${Role.TEACHER}, ${Role.SUPERADMIN}`,
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN,Role.TEACHER,Role.SUPERADMIN)
    @Get(":groupId")
    async getFiles(@Param("groupId", ParseIntPipe) groupId: number) {
        return this.filesService.getFiles(groupId);
    }

    @ApiOperation({
        summary: `${Role.ADMIN}, ${Role.TEACHER}, ${Role.SUPERADMIN}`,
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.ADMIN,Role.TEACHER,Role.SUPERADMIN)
    @ApiConsumes("multipart/form-data") 
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                file: { type: 'string', format: 'binary' },
            }
        }
    })
    @UseInterceptors(FileInterceptor("file", {
        storage: diskStorage({
            destination: "./src/uploads/files",
            filename: (req, file, cb) => {
                const filename = Date.now() + "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        }),
        fileFilter: (req, file, cb) => {
            const existFile = ["mp4", "webm", "mov", "avi"]

            if (!existFile.includes(file.mimetype.split("/")[1])) {
                cb(new UnsupportedMediaTypeException(), false)
            }

            cb(null, true)
        }
    }))
    @Post("group/:grupId/upload")
    async uploadFile(
        @Param("grupId", ParseIntPipe) grupId: number,
        @Query("lessonId", ParseIntPipe) lessonId: number,
        @UploadedFile() file: Express.Multer.File) { 
        return this.filesService.uploadFile(grupId,lessonId, file);
    }
}
