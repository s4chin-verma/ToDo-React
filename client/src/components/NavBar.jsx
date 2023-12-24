import { useState } from 'react';
import Todo from '../assets/to-do-list.png';
import {
    MDBContainer,
    MDBNavbar,
    MDBNavbarBrand,
    MDBNavbarToggler,
    MDBNavbarNav,
    MDBNavbarItem,
    MDBCollapse,
    MDBNavbarLink,
    MDBIcon
} from 'mdb-react-ui-kit';
import { useLocation } from 'react-router-dom';
import Logout from './Logout';

export default function NavBar() {
    const [showNav, setShowNav] = useState(false);
    const location = useLocation();

    return (
        <MDBNavbar expand='lg' light bgColor='light' className='px-5 sticky-top'>
            <MDBContainer fluid>
                <div className='d-flex align-item-cnter'>
                    <MDBNavbarBrand href="/todolist"><img style={{ height: '2rem' }} src={Todo} alt="logo" /></MDBNavbarBrand>
                    <MDBNavbarBrand href='/todolist' className='fw-bold'>To Do</MDBNavbarBrand>
                </div>
                {location.pathname === '/todolist' ? (
                    <Logout />
                ) : (
                    <>
                        <MDBNavbarToggler
                            type='button'
                            aria-expanded='false'
                            aria-label='Toggle navigation'
                            onClick={() => setShowNav(!showNav)}
                        >
                            <MDBIcon icon='bars' fas />
                        </MDBNavbarToggler>
                        <MDBCollapse navbar show={showNav}>
                            <MDBNavbarNav className='d-flex flex-direction-row justify-content-end'>
                                <MDBNavbarItem>
                                    <MDBNavbarLink href='register'>Register</MDBNavbarLink>
                                </MDBNavbarItem>
                                <MDBNavbarItem>
                                    <MDBNavbarLink href='/'>Login</MDBNavbarLink>
                                </MDBNavbarItem>
                            </MDBNavbarNav>
                        </MDBCollapse>
                    </>
                )}
            </MDBContainer>
        </MDBNavbar>
    );
}
