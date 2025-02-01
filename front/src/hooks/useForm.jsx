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

    return {
        form,
        ...form,
        changeForm,
        resetForm
    }
}
