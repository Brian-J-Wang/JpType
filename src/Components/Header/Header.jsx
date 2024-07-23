import './Header.css'

function Header(props) {
    return (
        <div className="header">
            <p className="header__logo">日本–Type</p> 
            <div className="header__nav">
                <p className="header__nav-link">practice</p>
                <p className="header__nav-link">reference</p>
                <p className="header__nav-link">about</p>
            </div>
        </div>
    )
}

export default Header