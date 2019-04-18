/* tslint:disable */
/*
 * Autogenerated by @creditkarma/thrift-typescript v3.5.0
 * DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
*/
import * as thrift from "test-lib";
import * as __NAMESPACE__ from "./.";
export interface IWork {
    __name: "Work";
    num1: number;
    num2: number;
    op?: __NAMESPACE__.Operation;
    comment?: string;
}
export interface IWorkArgs {
    num1?: number;
    num2: number;
    op?: __NAMESPACE__.Operation;
    comment?: string;
}
export const WorkCodec: thrift.IStructCodec<IWorkArgs, IWork> = {
    encode(args: IWorkArgs, output: thrift.TProtocol): void {
        const obj = {
            num1: (args.num1 != null ? args.num1 : 0),
            num2: args.num2,
            op: (args.op != null ? args.op : __NAMESPACE__.Operation.ADD),
            comment: args.comment
        };
        output.writeStructBegin("Work");
        if (obj.num1 != null) {
            output.writeFieldBegin("num1", thrift.TType.I32, 1);
            output.writeI32(obj.num1);
            output.writeFieldEnd();
        }
        if (obj.num2 != null) {
            output.writeFieldBegin("num2", thrift.TType.I32, 2);
            output.writeI32(obj.num2);
            output.writeFieldEnd();
        }
        else {
            throw new thrift.TProtocolException(thrift.TProtocolExceptionType.UNKNOWN, "Required field[num2] is unset!");
        }
        if (obj.op != null) {
            output.writeFieldBegin("op", thrift.TType.I32, 3);
            output.writeI32(obj.op);
            output.writeFieldEnd();
        }
        if (obj.comment != null) {
            output.writeFieldBegin("comment", thrift.TType.STRING, 4);
            output.writeString(obj.comment);
            output.writeFieldEnd();
        }
        output.writeFieldStop();
        output.writeStructEnd();
        return;
    },
    decode(input: thrift.TProtocol): IWork {
        let _args: any = {};
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
                    if (fieldType === thrift.TType.I32) {
                        const value_1: number = input.readI32();
                        _args.num1 = value_1;
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                case 2:
                    if (fieldType === thrift.TType.I32) {
                        const value_2: number = input.readI32();
                        _args.num2 = value_2;
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                case 3:
                    if (fieldType === thrift.TType.I32) {
                        const value_3: __NAMESPACE__.Operation = input.readI32();
                        _args.op = value_3;
                    }
                    else {
                        input.skip(fieldType);
                    }
                    break;
                case 4:
                    if (fieldType === thrift.TType.STRING) {
                        const value_4: string = input.readString();
                        _args.comment = value_4;
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
        if (_args.num1 !== undefined && _args.num2 !== undefined) {
            return {
                __name: "Work",
                num1: (_args.num1 != null ? _args.num1 : 0),
                num2: _args.num2,
                op: (_args.op != null ? _args.op : __NAMESPACE__.Operation.ADD),
                comment: _args.comment
            };
        }
        else {
            throw new thrift.TProtocolException(thrift.TProtocolExceptionType.UNKNOWN, "Unable to read Work from input");
        }
    }
};
export class Work implements thrift.IStructLike, IWork {
    public num1: number = 0;
    public num2: number;
    public op?: __NAMESPACE__.Operation = __NAMESPACE__.Operation.ADD;
    public comment?: string;
    public readonly __name = "Work";
    constructor(args: IWorkArgs) {
        if (args.num1 != null) {
            const value_5: number = args.num1;
            this.num1 = value_5;
        }
        if (args.num2 != null) {
            const value_6: number = args.num2;
            this.num2 = value_6;
        }
        else {
            throw new thrift.TProtocolException(thrift.TProtocolExceptionType.UNKNOWN, "Required field[num2] is unset!");
        }
        if (args.op != null) {
            const value_7: __NAMESPACE__.Operation = args.op;
            this.op = value_7;
        }
        if (args.comment != null) {
            const value_8: string = args.comment;
            this.comment = value_8;
        }
    }
    public static read(input: thrift.TProtocol): Work {
        return new Work(WorkCodec.decode(input));
    }
    public static write(args: IWorkArgs, output: thrift.TProtocol): void {
        return WorkCodec.encode(args, output);
    }
    public write(output: thrift.TProtocol): void {
        return WorkCodec.encode(this, output);
    }
}
