import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addressService } from '@/services/api';
import StepIndicator from './components/StepIndicator';
import AddressStep from './components/AddressStep';
import OrderSummaryStep from './components/OrderSummaryStep';
import PaymentStep from './components/PaymentStep';
import styles from './Checkout.module.css';

const inr = (n) => Number(n || 0).toLocaleString('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 });

export default function CheckoutPage() {
  const navigate = useNavigate();

  const { step, selectedAddressId, buyNowItem } = useSelector((s) => s.checkout);
  const { items: cartItems, summary: cartSummary } = useSelector((s) => s.cart);

  const [addresses, setAddresses]       = useState([]);
  const [loadingAddr, setLoadingAddr]   = useState(true);

  useEffect(() => {
    addressService.getAddresses()
      .then((r) => setAddresses(r.data || []))
      .catch(() => {})
      .finally(() => setLoadingAddr(false));
  }, []);

  const isBuyNow = !!buyNowItem;

  const displayItems = isBuyNow
    ? [{ id: buyNowItem.product.id, product: buyNowItem.product, quantity: buyNowItem.quantity }]
    : cartItems;

  const priceDetails = isBuyNow
    ? {
        itemCount: buyNowItem.quantity,
        totalMrp: buyNowItem.product.mrp * buyNowItem.quantity,
        totalDiscount: (buyNowItem.product.mrp - buyNowItem.product.sellingPrice) * buyNowItem.quantity,
        deliveryFee: 0,
        totalAmount: buyNowItem.product.sellingPrice * buyNowItem.quantity,
      }
    : cartSummary;

  const selectedAddress = addresses.find((a) => a.id === selectedAddressId) || null;

  if (!loadingAddr && displayItems.length === 0 && !isBuyNow) {
    navigate('/cart');
    return null;
  }

  return (
    <div className={styles.page}>
      <StepIndicator currentStep={step} />

      <div className={styles.container}>
        <div className={styles.layout}>
          {/* ── Left: current step ── */}
          <div className={styles.leftCol}>
            {step === 1 && (
              <AddressStep
                addresses={loadingAddr ? [] : addresses}
                onAddressesChange={setAddresses}
              />
            )}
            {step === 2 && (
              <OrderSummaryStep
                displayItems={displayItems}
                selectedAddress={selectedAddress}
              />
            )}
            {step === 3 && (
              <PaymentStep
                priceDetails={priceDetails}
              />
            )}
          </div>

          {/* ── Right: persistent price panel ── */}
          <div className={styles.rightCol}>
            <div className={styles.pricePanel}>
              <div className={styles.pricePanelTitle}>Price Details</div>
              <div className={styles.pricePanelBody}>
                <div className={styles.priceDetail}>
                  <span>Price ({priceDetails?.itemCount || displayItems.length} items)</span>
                  <span>{inr(priceDetails?.totalMrp)}</span>
                </div>
                <div className={styles.priceDetail}>
                  <span>Discount</span>
                  <span className={styles.priceDetailGreen}>−{inr(priceDetails?.totalDiscount)}</span>
                </div>
                <div className={styles.priceDetail}>
                  <span>Delivery Charges</span>
                  <span className={styles.priceDetailGreen}>Free</span>
                </div>
                <hr className={styles.priceDivider} />
                <div className={`${styles.priceDetail} ${styles.priceDetailBold}`}>
                  <span>Total Amount</span>
                  <span>{inr(priceDetails?.totalAmount)}</span>
                </div>

                {(priceDetails?.totalDiscount || 0) > 0 && (
                  <div className={styles.savingsBanner}>
                    🎉 You save {inr(priceDetails?.totalDiscount)}!
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
