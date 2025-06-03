export function getCurrentUser() {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
}
  
export function getCurrentUserEmail() {
const user = getCurrentUser();
return user?.email || '';
}

export function getCurrentUserRole() {
const user = getCurrentUser();
return user?.role || '';
}

export function getCurrentUsername() {
const user = getCurrentUser();
return user?.username || '';
}
  