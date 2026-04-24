export function getUserInitials(username: string | undefined) {
  if (!username) {
    return '??';
  }
  const initials: string = (
    username[0] + username.charAt(username.indexOf(' ') + 1)
  )
    .split(' ')
    .join('')
    .toUpperCase();
  return initials;
}
