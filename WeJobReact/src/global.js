//קובץ שמטרתו שמירת קבועים בקוד
export default {
    BASE_URL: 'http://10.0.2.2:53411/api/',//הכתובת של השרת
    FACEBOOK_TOKEN_STRING: 'FacebookToken',// שומר את הטוקן של ההתחברות לפייסבוק
    USER_EMAIL: 'UserEmail',// שומר את האימייל של הסטודנט שהתחבר
    DEFUALT_REQUEST_TIMEOUT_MS: 15000,
    LOGIN_PAGE: 'התחברות',
    ASYNC_STORAGE_STUDEMT: 'StudentAsyncStorageData',// המפתח של הלוקאל סטוראג' ששומר את הפרטים של הסטונדט
    USER_SELECTED_DEPARTMENT_CODE: 'SelectedDepartmentCode'
}
