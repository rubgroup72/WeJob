//קובץ שמטרתו שמירת קבועים בקוד
export default {
    BASE_URL: 'http://10.0.2.2:53411/api/', // 'https://proj.ruppin.ac.il/bgroup72/prod/api/',//הכתובת של השרת http://10.0.2.2:53411/api/
    FACEBOOK_TOKEN_STRING: 'FacebookToken',// שומר את הטוקן של ההתחברות לפייסבוק
    USER_EMAIL: 'UserEmail',// שומר את האימייל של הסטודנט שהתחבר
    DEFUALT_REQUEST_TIMEOUT_MS: 15000,
    ASYNC_STORAGE_STUDEMT: 'StudentAsyncStorageData',// המפתח של הלוקאל סטוראג' ששומר את הפרטים של הסטונדט
    USER_SELECTED_DEPARTMENT_CODE: 'SelectedDepartmentCode',
    IS_USER_LOGGED_IN: 'UserLoggedIn',
    USER_SELECTED_CATEGORY_CODE: 'SelectedCategoryCode',
    USER_SELECTED_CATEGORY_NAME: 'SelectedCategoryName',
    IS_JUST_REGISTERED: 'IsJustRegistered'
}
