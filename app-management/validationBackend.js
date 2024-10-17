import dayjs from 'dayjs';

const sanitizeAndValidateProduct = (data, existingProduct = {}) => {
  const errors = {};
  let valid = true;

  const sanitize = (input) => {
    return input ? input.replace(/[^a-zA-Z0-9 .,()/ąćęłńóśźżĄĆĘŁŃÓŚŹŻ-]/g, '') : input;
  };

  const validatePrice = (price) => {
    const re = /^[0-9]+([.][0-9]{1,2})?$/;
    return re.test(String(price));
  };

  const allowedFieldsByCategory = {
    'Telefony komórkowe': {
      'Smartfony': ['name', 'category', 'subcategory', 'brand', 'os', 'screenSize', 'storage', 'ram', 'battery', 'color', 'price', 'inStock', 'promoted', 'img', 'status', 'id'],
      'Feature Phones': ['name', 'category', 'subcategory', 'brand', 'os', 'screenSize', 'storage', 'ram', 'battery', 'color', 'price', 'inStock', 'promoted', 'img', 'status', 'id']
    },
    'Akcesoria': {
      'Etui': ['name', 'category', 'subcategory', 'brand', 'applicableModel', 'material', 'color', 'price', 'inStock', 'promoted', 'img', 'status', 'id'],
      'Szkła ochronne': ['name', 'category', 'subcategory', 'brand', 'applicableModel','color', 'screenSize', 'price', 'inStock', 'promoted', 'img', 'status', 'id'],
      'Ładowarki': ['name', 'category', 'subcategory', 'brand', 'applicableModel','color', 'chargerType', 'price', 'inStock', 'promoted', 'img', 'status', 'id'],
      'Słuchawki': ['name', 'category', 'subcategory', 'brand', 'applicableModel', 'type', 'color', 'price', 'inStock', 'promoted', 'img', 'status', 'id'],
      'Powerbanki': ['name', 'category', 'subcategory', 'brand', 'applicableModel','color', 'battery', 'price', 'inStock', 'promoted', 'img', 'status', 'id']
    }
  };

  const allowedCategories = {
    'Telefony komórkowe': ['Smartfony', 'Feature Phones'],
    'Akcesoria': ['Etui', 'Szkła ochronne', 'Ładowarki', 'Słuchawki', 'Powerbanki'],
  };

  const allowedBrands = {
    'Smartfony': ['Apple', 'Samsung', 'Huawei', 'Xiaomi'],
    'Feature Phones': ['Nokia'],
    'Akcesoria': ['Samsung', 'Apple', 'Xiaomi', 'FOREVER']
  };

  const applicableModels = {
    Samsung: ['Galaxy A40', 'Galaxy A70', 'Galaxy S10'],
    Apple: ['Iphone 10', 'Iphone 11'],
    Xiaomi: ['Redmi 14', 'Redmi 18'],
    FOREVER: ['Galaxy A40', 'Galaxy A70', 'Galaxy S10', 'Iphone 10', 'Iphone 11', 'Redmi 14', 'Redmi 15'],
  };

  const osOptions = {
    Samsung: ['Android 13', 'Android 14', 'Android 15'],
    Apple: ['iOS 16', 'iOS 17', 'iOS 18'],
    Xiaomi: ['Android 12', 'Android 13', 'Android 14'],
    Huawei: ['Android 12', 'Android 13', 'Android 14', 'Android 15'],
    Nokia: ['AliOS', 'Nokia Series 30+', 'inny'],
  };

  const colors = ['czarny', 'biały', 'niebieski', 'czerwony', 'bezbarwny'];
  const materials = ['guma', 'plastik', 'drewno', 'metal', 'silikon', 'skóra', 'szkło'];
  const chargerTypes = ['USB-C', 'USB-Micro'];
  const types = ['douszne', 'nauszne'];

  //---------------------Category & subcategory
  if (!allowedCategories[data.category]) {
    errors.category = `Invalid category: ${data.category}`;
    valid = false;
  } else if (!allowedCategories[data.category].includes(data.subcategory)) {
    errors.subcategory = `Invalid subcategory for category ${data.category}: ${data.subcategory}`;
    valid = false;
  }

  if (valid) {
    const allowedFields = allowedFieldsByCategory[data.category][data.subcategory];
    const providedFields = Object.keys(data);

    providedFields.forEach(field => {
      if (!allowedFields.includes(field) && field in data) {
        if (data[field] !== '' && data[field] !== undefined) {
          errors[field] = `Field ${field} is not allowed for subcategory ${data.subcategory} unless it is empty.`;
          valid = false;
        }
      }
    });
  }

  //------------------------------Brand
  if (allowedBrands[data.subcategory] && !allowedBrands[data.subcategory].includes(data.brand)) {
    errors.brand = `Invalid brand for subcategory ${data.subcategory}: ${data.brand}`;
    valid = false;
  }

  //--------------------------Applicable model
  if (data.category === 'Akcesoria' && data.applicableModel) {
    const modelsForBrand = applicableModels[data.brand];
    if (!modelsForBrand || !modelsForBrand.includes(data.applicableModel)) {
      errors.applicableModel = `Invalid applicable model for brand ${data.brand}: ${data.applicableModel}`;
      valid = false;
    }
  }

  //--------------------------Operating System
  if (data.category === 'Telefony komórkowe' && ['Smartfony', 'Feature Phones'].includes(data.subcategory)) {
    if (!osOptions[data.brand] || !osOptions[data.brand].includes(data.os)) {
      errors.os = `Invalid OS for brand ${data.brand}: ${data.os}`;
      valid = false;
    }
  }

  //---------------------------Charger type
  if (data.subcategory === 'Ładowarki' && !chargerTypes.includes(data.chargerType)) {
    errors.chargerType = `Invalid charger type for Ładowarki: ${data.chargerType}`;
    valid = false;
  }

  //----------------------------Type (plugin type)
  if (data.subcategory === 'Słuchawki' && !types.includes(data.type)) {
    errors.type = `Invalid headphone type for Słuchawki: ${data.type}`;
    valid = false;
  }

  //---------------------Material
  if (data.subcategory === 'Etui' && !materials.includes(data.material)) {
    errors.material = `Invalid material for Etui: ${data.material}`;
    valid = false;
  }

  if (['Smartfony', 'Feature Phones', 'Etui', 'Słuchawki'].includes(data.subcategory)) {
    if (Array.isArray(data.color) && data.color.length > 0) {
      if (!data.color.every(color => colors.includes(color))) {
        errors.color = `Invalid color(s) for ${data.subcategory}. Allowed colors: ${colors.join(', ')}`;
        valid = false;
      }
    } else {
      data.color = [];
    }
  } else if (['Powerbanki', 'Ładowarki', 'Szkła ochronne'].includes(data.subcategory)) {
    if (Array.isArray(data.color)) {
      if (data.color.length > 0) {
        errors.color = `Field color is not allowed for subcategory ${data.subcategory} unless it is empty.`;
        valid = false;
      } else {
        data.color = [];
      }
    } else {
      data.color = [];
    }
  } else {
    if (data.color && Array.isArray(data.color) && data.color.length > 0) {
      errors.color = `Field color is not allowed for subcategory ${data.subcategory} unless it is empty.`;
      valid = false;
    } else {
      data.color = [];
    }
  }

  //------------------------Status
  if (data.status && !['active', 'deleted', '', undefined].includes(data.status)) {
    errors.status = `Invalid status: ${data.status}. Allowed values are 'active' or 'deleted'`;
    valid = false;
  }

  data.status = data.status || existingProduct.status;

  //--------------------------Other fields
  data.name = sanitize(data.name) || existingProduct.name;
  data.category = sanitize(data.category) || existingProduct.category;
  data.subcategory = sanitize(data.subcategory) || existingProduct.subcategory;
  data.brand = sanitize(data.brand) || existingProduct.brand;
  data.material = sanitize(data.material) || existingProduct.material;
  data.color = (data.color && Array.isArray(data.color)) ? data.color.map(sanitize) : existingProduct.color;
  data.chargerType = sanitize(data.chargerType) || existingProduct.chargerType;
  data.type = sanitize(data.type) || existingProduct.type;
  data.price = data.price !== undefined ? parseFloat(data.price) : existingProduct.price;

  //------------------------General validations
  const validateString = (field, value, min, max) => {
    if (!value) {
      errors[field] = `${field} is required.`;
      valid = false;
    } else if (value.length < min || value.length > max) {
      errors[field] = `${field} must be between ${min} and ${max} characters.`;
      valid = false;
    }
  };

  const validateNumber = (field, value) => {
    if (field === 'price') {
      if (!validatePrice(value)) {
        errors[field] = 'Price must be a valid number with up to two decimal places.';
        valid = false;
      }
    } else if (isNaN(value) || value < 0) {
      errors[field] = `${field} must be a valid number.`;
      valid = false;
    }
  };

  validateString('name', data.name, 3, 40);
  validateString('category', data.category, 3, 30);
  validateString('subcategory', data.subcategory, 3, 30);
  validateString('brand', data.brand, 2, 20);
  validateNumber('price', data.price);

  const validateBooleanField = (field, value, allowedValues) => {
    if (!allowedValues.includes(value)) {
      errors[field] = `Invalid value for ${field}: ${value}. Allowed values: ${allowedValues.join(', ')}`;
      valid = false;
    }
  };

  validateBooleanField('inStock', data.inStock, ['yes', 'no', 'Tak', 'Nie']);
  validateBooleanField('promoted', data.promoted, [true, false, 'Tak', 'Nie']);
  validateBooleanField('status', data.status, ['active', 'deleted', '', undefined]);

  return { valid, errors };
};

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

const validatePhone = (phone) => {
  const re = /^[0-9+]+$/;
  return re.test(String(phone));
};

const sanitizeAndValidateUser = (data) => {
  let errors = {};
  let valid = true;

  // Sanitize helper
  const sanitize = (input) => {
    return input ? input.replace(/[^a-zA-Z0-9 .,()/ąćęłńóśźżĄĆĘŁŃÓŚŹŻ-]/g, '') : '';
  };

  // Name validation
  data.userName = sanitize(data.userName);
  if (!data.userName) {
    errors.userName = 'Nazwa nie może być pusta';
    valid = false;
  } else if (data.userName.length < 3) {
    errors.userName = 'Nazwa musi mieć min. 3 znaki.';
    valid = false;
  } else if (data.userName.length > 40) {
    errors.userName = 'Nazwa może mieć max. 40 znaków.';
    valid = false;
  }

  // Full name validation
  data.fullName = sanitize(data.fullName);
  if (!data.fullName) {
    errors.fullName = 'Pełna nazwa nie może być pusta';
    valid = false;
  } else if (data.fullName.length < 3) {
    errors.fullName = 'Pełna nazwa musi mieć min. 3 znaki.';
    valid = false;
  } else if (data.fullName.length > 40) {
    errors.fullName = 'Pełna nazwa może mieć max. 40 znaków.';
    valid = false;
  }

  // Email validation
  if (!data.email) {
    errors.email = 'Email nie może być pusty';
    valid = false;
  } else if (data.email.length > 35) {
    errors.email = 'Email może mieć max. 35 znaków';
    valid = false;
  } else if (!validateEmail(data.email)) {
    errors.email = 'Nieprawidłowy format email';
    valid = false;
  }

  // Phone validation
  if (!data.phone) {
    errors.phone = 'Telefon nie może być pusty';
    valid = false;
  } else if (data.phone.length > 12) {
    errors.phone = 'Telefon może mieć max. 12 znaków';
    valid = false;
  } else if (!validatePhone(data.phone)) {
    errors.phone = 'Telefon może zawierać wyłącznie cyfry i znak + ';
    valid = false;
  }

  // Address validation (checking both min and max boundaries)
  data.address = sanitize(data.address);
  if (!data.address) {
    errors.address = 'Adres nie może być pusty';
    valid = false;
  } else if (data.address.length < 10) {
    errors.address = 'Adres musi mieć min. 10 znaków';
    valid = false;
  } else if (data.address.length > 40) {
    errors.address = 'Adres może mieć max. 40 znaków';
    valid = false;
  }

  // Date of birth validation
  if (!data.dob) {
    errors.dob = 'Data urodzenia nie może być pusta';
    valid = false;
  } else if (dayjs(data.dob).isAfter(dayjs())) {
    errors.dob = 'Data urodzenia nie może być w przyszłości';
    valid = false;
  }

  if (data.status && !['active', 'deleted', 'usunięty','aktywny','zawieszony','on-hold','nieaktywny', '', undefined].includes(data.status)) {
    errors.status = `Invalid status: ${data.status}. Allowed values are 'active', 'deleted', or 'usunięty'`;
    valid = false;
  }

  return { valid, errors };
};

export { sanitizeAndValidateProduct, sanitizeAndValidateUser };
