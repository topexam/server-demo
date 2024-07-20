import { ApiProperty } from "@nestjs/swagger";

export class UpdatePasswordInputDTO {
    @ApiProperty()
    newPassword: string;
}