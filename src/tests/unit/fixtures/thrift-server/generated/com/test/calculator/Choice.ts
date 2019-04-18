/* tslint:disable */
/*
 * Autogenerated by @creditkarma/thrift-typescript v3.5.0
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
*/
import * as thrift from "test-lib";
import * as __NAMESPACE__ from "./.";
export interface IChoice {
    __name: "Choice";
    firstName?: __NAMESPACE__.IFirstName;
    lastName?: __NAMESPACE__.ILastName;
}
export interface IChoiceArgs {
    firstName?: __NAMESPACE__.IFirstNameArgs;
    lastName?: __NAMESPACE__.ILastNameArgs;
}
export const ChoiceCodec: thrift.IStructCodec<IChoiceArgs, IChoice> = {
    encode(args: IChoiceArgs, output: thrift.TProtocol): void {
        let _fieldsSet: number = 0;
        const obj = {
            firstName: args.firstName,
            lastName: args.lastName
        };
        output.writeStructBegin("Choice");
        if (obj.firstName != null) {
            _fieldsSet++;
            output.writeFieldBegin("firstName", thrift.TType.STRUCT, 1);
            __NAMESPACE__.FirstNameCodec.encode(obj.firstName, output);
            output.writeFieldEnd();
        }
        if (obj.lastName != null) {
            _fieldsSet++;
            output.writeFieldBegin("lastName", thrift.TType.STRUCT, 2);
            __NAMESPACE__.LastNameCodec.encode(obj.lastName, output);
            output.writeFieldEnd();
        }
        output.writeFieldStop();
        output.writeStructEnd();
        if (_fieldsSet > 1) {
            throw new thrift.TProtocolException(thrift.TProtocolExceptionType.INVALID_DATA, "TUnion cannot have more than one value");
        }
        else if (_fieldsSet < 1) {
            throw new thrift.TProtocolException(thrift.TProtocolExceptionType.INVALID_DATA, "TUnion must have one value set");
        }
        return;
    },
    decode(input: thrift.TProtocol): IChoice {
        let _fieldsSet: number = 0;
        let _returnValue: IChoice | null = null;
        input.readStructBegin();
        while (true) {
            const ret: thrift.IThriftField = input.readFieldBegin();
            const fieldType: thrift.TType = ret.fieldType;
            const fieldId: number = ret.fieldId;
            if (fieldType === thrift.TType.STOP) {
                break;
            }
            switch (fieldId) {
                case 1:
                    if (fieldType === thrift.TType.STRUCT) {
                        _fieldsSet++;
                        const value_1: __NAMESPACE__.IFirstName = __NAMESPACE__.FirstNameCodec.decode(input);
                        _returnValue = { __name: "Choice", firstName: value_1 };
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                case 2:
                    if (fieldType === thrift.TType.STRUCT) {
                        _fieldsSet++;
                        const value_2: __NAMESPACE__.ILastName = __NAMESPACE__.LastNameCodec.decode(input);
                        _returnValue = { __name: "Choice", lastName: value_2 };
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                default: {
                    input.skip(fieldType);
                }
            }
            input.readFieldEnd();
        }
        input.readStructEnd();
        if (_fieldsSet > 1) {
            throw new thrift.TProtocolException(thrift.TProtocolExceptionType.INVALID_DATA, "TUnion cannot have more than one value");
        }
        else if (_fieldsSet < 1) {
            throw new thrift.TProtocolException(thrift.TProtocolExceptionType.INVALID_DATA, "TUnion must have one value set");
        }
        if (_returnValue !== null) {
            return _returnValue;
        }
        else {
            throw new thrift.TProtocolException(thrift.TProtocolExceptionType.UNKNOWN, "Unable to read data for TUnion");
        }
    }
};
export class Choice implements thrift.IStructLike, IChoice {
    public firstName?: __NAMESPACE__.IFirstName;
    public lastName?: __NAMESPACE__.ILastName;
    public readonly __name = "Choice";
    constructor(args: IChoiceArgs = {}) {
        let _fieldsSet: number = 0;
        if (args.firstName != null) {
            _fieldsSet++;
            const value_3: __NAMESPACE__.IFirstName = new __NAMESPACE__.FirstName(args.firstName);
            this.firstName = value_3;
        }
        if (args.lastName != null) {
            _fieldsSet++;
            const value_4: __NAMESPACE__.ILastName = new __NAMESPACE__.LastName(args.lastName);
            this.lastName = value_4;
        }
        if (_fieldsSet > 1) {
            throw new thrift.TProtocolException(thrift.TProtocolExceptionType.INVALID_DATA, "TUnion cannot have more than one value");
        }
        else if (_fieldsSet < 1) {
            throw new thrift.TProtocolException(thrift.TProtocolExceptionType.INVALID_DATA, "TUnion must have one value set");
        }
    }
    public static read(input: thrift.TProtocol): Choice {
        return new Choice(ChoiceCodec.decode(input));
    }
    public static write(args: IChoiceArgs, output: thrift.TProtocol): void {
        return ChoiceCodec.encode(args, output);
    }
    public write(output: thrift.TProtocol): void {
        return ChoiceCodec.encode(this, output);
    }
}
