"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateStudentDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const create_dto_1 = require("./create.dto");
class UpdateStudentDto extends (0, swagger_1.PartialType)(create_dto_1.CreateStudentDto) {
}
exports.UpdateStudentDto = UpdateStudentDto;
//# sourceMappingURL=update.dto.js.map