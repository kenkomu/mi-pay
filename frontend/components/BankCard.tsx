import React from 'react';

const BankCard = ({userName, cardNumber, expiration = true }) => {
  return (
    <div className="flex flex-col">
      <div className="bank-card">
        <div className="bank-card_content">
          <div>
            <h1 className="text-16 font-semibold text-white">
              {userName}
            </h1>
          </div>

          <article className="flex flex-col gap-2">
            <div className="flex justify-between">
              <h1 className="text-12 font-semibold text-white">
                {userName}
              </h1>
              <h2 className="text-12 font-semibold text-white">
                {expiration || '●● / ●●'}  {/* Show expiration if available */}
              </h2>
            </div>
            <p className="text-14 font-semibold tracking-[1.1px] text-white">
              ●●●● ●●●● ●●●● <span className="text-16">{cardNumber || '●●●●'}</span> {/* Show last 4 digits */}
            </p>
          </article>
        </div>

        <div className="bank-card_icon">
          {/* Assuming static icons here */}
        </div>
      </div>
    </div>
  );
};

export default BankCard;
