import React from 'react';
import {Link} from 'react-router-dom';

import './Header.scss';
import logo from '../../images/logo.svg'

const Header = () =>{
    return (
        <header className='header'>
            <img alt='logo gear' className='header__logo' src={logo}/>
            <nav className='header__nav'>
                <button className='header__nav-button'>What is GEAR?</button>
                <button className='header__nav-button'>How it works</button>
                <button className='header__nav-button'>Use cases</button>
                <button className='header__nav-button'>Competitive analyze</button>
                <button className='header__nav-button'>Team</button>
                <button className='header__nav-button'>Tokenomics</button>
                <button className='header__nav-button'>Timeline</button>
                <Link to='/sign-in'>
                    <button className='header__nav-button'>Contact us</button>
                </Link>
            </nav>
        </header>
    )
}

export default Header;