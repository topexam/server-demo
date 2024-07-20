import { ApiProperty } from "@nestjs/swagger";

export class LoginInputDTO {
    @ApiProperty()
    userNameOrEmail: string;
    @ApiProperty()
    password: string;
}