'use client';
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { userLoggedOut } from "@/redux/features/auth/authSlice";
import { useCurrency } from "@/contexts/CurrencyContext";
import { useGetActiveCurrenciesQuery } from "@/redux/features/currencyApi";

// language
function Language({active,handleActive}) {
  return (
    <div className="tp-header-top-menu-item tp-header-lang">
      <span
        onClick={() => handleActive('lang')}
        className="tp-header-lang-toggle"
        id="tp-header-lang-toggle"
      >
        English
      </span>
      <ul className={active === 'lang' ? "tp-lang-list-open" : ""}>
        <li>
          <a href="#">Spanish</a>
        </li>
        <li>
          <a href="#">Russian</a>
        </li>
        <li>
          <a href="#">Portuguese</a>
        </li>
      </ul>
    </div>
  );
}

// currency
function Currency({active,handleActive}) {
  const { currentCurrency, setCurrentCurrency } = useCurrency();
  const { data: currencies } = useGetActiveCurrenciesQuery();

  const handleCurrencyChange = (currency) => {
    setCurrentCurrency(currency);
    handleActive(''); // Close dropdown
  };

  return (
    <div className="tp-header-top-menu-item tp-header-currency">
      <span
        onClick={() => handleActive('currency')}
        className="tp-header-currency-toggle"
        id="tp-header-currency-toggle"
      >
        {currentCurrency?.code || 'USD'}
      </span>
      <ul className={active === 'currency' ? "tp-currency-list-open" : ""}>
        {currencies?.data?.map((currency) => (
          <li key={currency._id}>
            <a href="#" onClick={(e) => {
              e.preventDefault();
              handleCurrencyChange(currency);
            }}>
              {currency.code}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

// setting
function ProfileSetting({active,handleActive}) {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  // handle logout
  const handleLogout = () => {
    dispatch(userLoggedOut());
    router.push('/')
  }
  return (
    <div className="tp-header-top-menu-item tp-header-setting">
      <span
        onClick={() => handleActive('setting')}
        className="tp-header-setting-toggle"
        id="tp-header-setting-toggle"
      >
        Account
      </span>
      <ul className={active === 'setting' ? "tp-setting-list-open" : ""}>
        <li>
          <Link href="/profile">My Profile</Link>
        </li>
        <li>
          <Link href="/wishlist">Wishlist</Link>
        </li>
        <li>
          <Link href="/cart">Cart</Link>
        </li>
        <li>
          {!user?.name &&<Link href="/login" className="cursor-pointer">Login</Link>}
          {user?.name &&<a onClick={handleLogout} className="cursor-pointer">Logout</a>}
        </li>
      </ul>
    </div>
  );
}

const HeaderTopRight = () => {
  const [active, setIsActive] = useState('');
  // handle active
  const handleActive = (type) => {
    if(type === active){
      setIsActive('')
    }
    else {
      setIsActive(type)
    }
  }
  return (
    <div className="tp-header-top-menu d-flex align-items-center justify-content-end">
      <Language active={active} handleActive={handleActive} />
      <Currency active={active} handleActive={handleActive} />
      <ProfileSetting active={active} handleActive={handleActive} />
    </div>
  );
};

export default HeaderTopRight;
