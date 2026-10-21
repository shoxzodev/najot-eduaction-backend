import { Body, Controller, Get, Param, Patch, Post, Req, UnsupportedMediaTypeException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateAdminDto } from './dto/create.admin.dto';
import { AuthGuard } from 'src/common/guards/jwt-auth.guard';
import { Roles } from 'src/common/decorators/role';
import { Role } from '@prisma/client';
import { RolesGuard } from 'src/common/guards/role.guard';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation } from '@nestjs/swagger';
import { ChangePersonalDataDto } from './dto/change.personal-data.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@ApiBearerAuth()
@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) { }

    @ApiOperation({
        summary: `${Role.SUPERADMIN}`
    })
    @UseGuards(AuthGuard, RolesGuard)
    @Roles(Role.SUPERADMIN)
    @Get('admin/all')
    getAllAdmins() {
        return this.userService.getAllAdmins()
    }

    @ApiOperation({
        summary: `${Role.SUPERADMIN}, ${Role.ADMIN}`
    })
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.SUPERADMIN)
    @Post("admin")
    createAdmin(@Body() payload: CreateAdminDto) {
        return this.userService.createAdmin(payload)
    }

    // new feature ( you can now see the user data info ( for : admin | superadmin | teacher | student ) )
    @ApiOperation({
        summary: `${Role.ADMIN} , ${Role.STUDENT} ${Role.TEACHER} ${Role.SUPERADMIN}`
    })
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.TEACHER , Role.STUDENT , Role.SUPERADMIN)
    @Get("personal/info")
    getUserInfo(@Req() req:Request) {
        return this.userService.getUserInfo(req["user"]);
    }
    
    // new feature ( you can now change your profile image and password )
    @ApiOperation({
        summary: `${Role.ADMIN} , ${Role.STUDENT} ${Role.TEACHER}`
    })
    @UseGuards(AuthGuard)
    @Roles(Role.ADMIN, Role.TEACHER , Role.STUDENT)
    @Patch("personal/info")
    @ApiConsumes("multipart/form-data")
    @ApiBody({
        schema:{
            type:"object",
            properties:{
                email:{type:"string" , example:"email@gmail.com"},
                photo:{type:"string" , format:"binary"},
                phone:{type:"string" , example:"+998995507613"},
                current_password:{type:"string" , example:"x04041234A"},
                new_password:{type:"string" , example:"x04041234A"}
            }
        }
    })
    @UseInterceptors(FileInterceptor("photo", {
        storage: diskStorage({
            destination: "./src/uploads",
            filename: (_, file, cb) => {
                const filename = Date.now() + "." + file.mimetype.split("/")[1]
                cb(null, filename)
            }
        }),
        fileFilter:(_,file,cb) =>{
            const existFile = ["png","jpg","jpeg"]

            if(!existFile.includes(file.mimetype.split("/")[1])){
                cb(new UnsupportedMediaTypeException(),false)
            }

            cb(null,true)
        }
    }))
    async changeUserPersonalData(@Req() req:Request , @Body() payload:ChangePersonalDataDto , @UploadedFile() file?: Express.Multer.File ) {
        return await this.userService.changeUserInfo(req["user"] , payload , file)
    }
}