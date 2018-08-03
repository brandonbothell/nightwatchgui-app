/**
 * Returns a friendly OS name from process.platform.
 */
export function friendlyOsName (platform: NodeJS.Platform): string {
  if (platform === 'win32') {
    return 'Windows'
  }

  if (platform === 'android') {
    return 'Android'
  }

  if (platform === 'darwin') {
    return 'OS X'
  }

  if (platform === 'linux') {
    return 'Linux'
  }

  if (platform === 'aix') {
    return 'Advanced Interactive eXecutive'
  }

  if (platform === 'cygwin') {
    return 'Cygwin'
  }

  if (platform === 'freebsd') {
    return 'FreeBSD'
  }

  if (platform === 'openbsd') {
    return 'OpenBSD'
  }

  if (platform === 'sunos') {
    return 'SunOS'
  }

  return 'Unknown OS'
}
