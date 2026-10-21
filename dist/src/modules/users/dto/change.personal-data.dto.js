"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChangePersonalDataDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ChangePersonalDataDto {
    email;
    phone;
    current_password;
    new_password;
}
exports.ChangePersonalDataDto = ChangePersonalDataDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: "example@gmail.com" }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], ChangePersonalDataDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "+998775507614" }),
    (0, class_validator_1.IsPhoneNumber)(),
    __metadata("design:type", String)
], ChangePersonalDataDto.prototype, "phone", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "x04041234" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChangePersonalDataDto.prototype, "current_password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: "x04041234" }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], ChangePersonalDataDto.prototype, "new_password", void 0);
//# sourceMappingURL=change.personal-data.dto.js.map