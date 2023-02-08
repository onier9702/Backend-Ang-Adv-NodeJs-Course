

const menuFrontend = (role = 'USER_ROLE') => {

    console.log('Role: ', role);
    const menu = [
        {
          title: 'Dashboard',
          icon: 'mdi mdi-gauge',
          submenu: [
            { title: 'Main', url: '/dashboard' },
            { title: 'ProgressBar', url: '/dashboard/progress' },
            { title: 'Graphics', url: '/dashboard/graphic1' },
          ]
        },
        {
          title: 'Maintenance',
          icon: 'mdi mdi-folder-lock-open',
          submenu: [
            // { title: 'Users', url: '/dashboard/users' },
            { title: 'Hospitals', url: '/dashboard/hospitals' },
            { title: 'Doctors', url: '/dashboard/doctors' },
          ]
        }
    ];

    if ( role === 'ADMIN_ROLE' || role.includes('ADMIN_ROLE') ) {
        menu[1].submenu.unshift({ title: 'Users', url: '/dashboard/users' });
    }

    return menu;

}

module.exports = { menuFrontend };