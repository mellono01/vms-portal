//MongoDB
interface FormType {
    _id: string;
    FormTypeName: string;
    SchemaVersion: number;
}

//Zustand Store
interface FormTypesState {
    formTypes: FormType[];
}
  
interface FormTypesActions {
    setFormTypes(formTypes: FormType[]): void;
}

type FormTypesSlice = FormTypesState & FormTypesActions