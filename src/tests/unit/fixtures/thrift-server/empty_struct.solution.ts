export interface MyStruct {
}
export interface MyStruct_Loose {
}
export const MyStructCodec: thrift.IStructCodec<MyStruct_Loose, MyStruct> = {
    encode(args: MyStruct_Loose, output: thrift.TProtocol): void {
        output.writeStructBegin("MyStruct");
        output.writeFieldStop();
        output.writeStructEnd();
        return;
    },
    decode(input: thrift.TProtocol): MyStruct {
        input.readStructBegin();
        while (true) {
            const ret: thrift.IThriftField = input.readFieldBegin();
            const fieldType: thrift.TType = ret.fieldType;
            const fieldId: number = ret.fieldId;
            if (fieldType === thrift.TType.STOP) {
                break;
            }
            switch (fieldId) {
                default: {
                    input.skip(fieldType);
                }
            }
            input.readFieldEnd();
        }
        input.readStructEnd();
        return {};
    }
};
