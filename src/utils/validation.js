
import dayjs from 'dayjs';

export const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
    const re = /^[0-9+]+$/;
    return re.test(String(phone));
};

export const validatePrice = (price) => {
    const re = /^[0-9]+([.][0-9]{1,2})?$/;
    return re.test(String(price));
};




export const validateUserForm = (formData) => {
    let errors = {};
    let valid = true;

    if (!formData.userName) {
        errors.userName = 'Nazwa nie może być pusta';
        valid = false;
    } else if (formData.userName.length < 3) {
        errors.userName = 'Nazwa musi mieć min. 3 znaki.';
        valid = false;
    } else if (formData.userName.length > 40) {
        errors.userName = 'Nazwa może mieć max. 40 znaków';
        valid = false;
    }

    if (!formData.fullName) {
        errors.fullName = 'Pełna nazwa nie może być pusta';
        valid = false;
    } else if (formData.fullName.length < 3) {
        errors.fullName = 'Pełna nazwa musi mieć min. 3 znaki.';
        valid = false;
    } else if (formData.fullName.length > 40) {
        errors.fullName = 'Pełna nazwa może mieć max. 40 znaków';
        valid = false;
    }

    if (!formData.email) {
        errors.email = 'Email nie może być pusty';
        valid = false;
    } else if (formData.email.length > 35) {
        errors.email = 'Email może mieć max. 35 znaków';
        valid = false;
    } else if (!validateEmail(formData.email)) {
        errors.email = 'Nieprawidłowy format email';
        valid = false;
    }

    if (!formData.phone) {
        errors.phone = 'Telefon nie może być pusty';
        valid = false;
    } else if (formData.phone.length > 12) {
        errors.phone = 'Telefon może mieć max. 12 znaków';
        valid = false;
    } else if (!validatePhone(formData.phone)) {
        errors.phone = 'Telefon może zawierać wyłącznie cyfry i znak + ';
        valid = false;
    }

    if (!formData.address) {
        errors.address = 'Adres nie może być pusty';
        valid = false;
    } else if (formData.address.length > 40) {
        errors.address = 'Adres musi mieć min. 10 znaków';
        valid = false;
    }

    if (!formData.dob) {
        errors.dob = 'Data urodzenia nie może być pusta';
        valid = false;
    } else if (dayjs(formData.dob).isAfter(dayjs())) {
        errors.dob = 'Data urodzenia nie może być w przyszłości';
        valid = false;
    }

    return { valid, errors };
};

export const validateProductForm = (productData) => {
    let formErrors = {};
    let valid = true;

    if (!productData.name) {
        formErrors.name = "Nazwa nie może być pusta";
        valid = false;
    } else if (productData.name.length < 3) {
        formErrors.name = 'Nazwa musi mieć min. 3 znaki';
        valid = false;
    } else if (productData.name.length > 40) {
        formErrors.name = 'Nazwa może mieć max. 40 znaków';
        valid = false;
    }

    if (!productData.category) {
        formErrors.category = "Kategoria jest wymagana";
        valid = false;
    }
    if (!productData.subcategory) {
        formErrors.subcategory = "Podkategoria jest wymagana";
        valid = false;
    }
    if (!productData.price) {
        formErrors.price = "Cena jest wymagana";
        valid = false;
    } else if (validatePrice(!productData.price)) {
        formErrors.price = 'Cena może zawierać tylko cyfry i kropkę';
        valid = false;
    } else if (productData.price.length > 6) {
        formErrors.price = 'Cena może mieć max. 6 znaków';
        valid = false;
    }

    if (!productData.brand) {
        formErrors.brand = "Producent jest wymaganay";
        valid = false;
    }

    if (productData.category === 'Telefony komórkowe') {
        if (!productData.os) {
            formErrors.os = "System operacyjny jest wymagany";
            valid = false;
        }
        if (!productData.screenSize) {
            formErrors.screenSize = "Rozmiar ekranu jest wymagany";
            valid = false;
        }
        if (!productData.storage) {
            formErrors.storage = "Pamięć wbudowana jest wymagana";
            valid = false;
        }
        if (!productData.ram) {
            formErrors.ram = "RAM jest wymagany";
            valid = false;
        }
        if (!productData.battery) {
            formErrors.battery = "Pojemnośc baterii jest wymagana";
            valid = false;
        }
    }

    if (productData.category === 'Akcesoria') {
        if (!productData.applicableModel) {
            formErrors.applicableModel = "Pasujący model jest wymagany";
            valid = false;
        }

        if (productData.subcategory === 'Etui' && !productData.material) {
            formErrors.material = "Tworzywo jest wymagane";
            valid = false;
        }

        if (productData.subcategory === 'Szkła ochronne' && !productData.screenSize) {
            formErrors.screenSize = "Rozmiar ekranu jest wymagany";
            valid = false;
        }

        if (productData.subcategory === 'Ładowarki' && !productData.chargerType) {
            formErrors.chargerType = "Typ wejścia jest wymagany";
            valid = false;
        }

        if (productData.subcategory === 'Słuchawki' && !productData.type) {
            formErrors.type = "Typ słuchawek jest wymagany";
            valid = false;
        }

        if (productData.subcategory === 'Powerbanki' && !productData.battery) {
            formErrors.battery = "Pojemność jest wymagana";
            valid = false;
        }

    }

    return { valid, formErrors };
};
