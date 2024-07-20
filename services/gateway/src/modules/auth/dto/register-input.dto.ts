import { ApiProperty } from "@nestjs/swagger";

export class RegisterInputDTO {
    @ApiProperty()
    email: string;
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;
}