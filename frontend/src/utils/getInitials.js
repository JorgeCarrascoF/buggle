export const getInitials = (name) => {
    const names = name.split(" ");
    const initials = names.map(n => n[0].toUpperCase()).join("");
    return initials.slice(0, 2);
}