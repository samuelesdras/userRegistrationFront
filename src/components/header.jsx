import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return(
        <header className="mt-3">
            <Link to="/">Lista de usuários</Link>
        </header>
    );
}

export default Header