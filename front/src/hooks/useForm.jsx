import { useState } from "react"
export const useForm = (initForm = {}) => {
    const [form, setForm] = useState(initForm);

    const changeForm = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    const resetForm = () => {
        setForm(initForm);
    }

    const onKeyDown = (e, enterFunction) => {
        if(enterFunction != null){
            if (e.key === "Enter") {
                enterFunction();
            }
        }
        if(e.key === "Escape"){
            setForm({
                ...form,
                [e.target.name]: initForm[`${e.target.name}`]
            });
        }
    }

    return {
        form,
        ...form,
        changeForm,
        resetForm,
        onKeyDown
    }
}
