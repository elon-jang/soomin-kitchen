import { ko } from './ko';
import { en } from './en';

export const translations = {
    ko,
    en
};

export const useTranslation = (language) => {
    return translations[language] || translations.ko;
};
