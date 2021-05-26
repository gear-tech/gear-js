import React from 'react';

import './Header.scss';

const Header = () =>{
    return (
        <div className='header'>
            <picture className='header__logo'/>
            <nav className='header__nav'>
                <button className='header__nav-button'>What is GEAR?</button>
                <button className='header__nav-button'>How it works</button>
                <button className='header__nav-button'>Use cases</button>
                <button className='header__nav-button'>Competitive analyze</button>
                <button className='header__nav-button'>Team</button>
                <button className='header__nav-button'>Tokenomics</button>
                <button className='header__nav-button'>Timeline</button>
                <button className='header__nav-button'>Contact us</button>
            </nav>
        </div>
    )
}

export default Header;