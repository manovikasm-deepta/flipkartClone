import { createSlice } from '@reduxjs/toolkit';

function loadBuyNow() {
  try { return JSON.parse(sessionStorage.getItem('fk_buy_now')); } catch { return null; }
}

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    step:               1,
    selectedAddressId:  null,
    buyNowItem:         loadBuyNow(),
    paymentMethod:      'COD',
    confirmationEmail:  '',
  },
  reducers: {
    setStep(state, { payload }) {
      state.step = payload;
    },
    setSelectedAddress(state, { payload }) {
      state.selectedAddressId = payload;
    },
    setBuyNowItem(state, { payload }) {
      state.buyNowItem = payload;
      try { sessionStorage.setItem('fk_buy_now', JSON.stringify(payload)); } catch (_e) { /* sessionStorage unavailable */ }
    },
    clearBuyNow(state) {
      state.buyNowItem = null;
      try { sessionStorage.removeItem('fk_buy_now'); } catch (_e) { /* sessionStorage unavailable */ }
    },
    setPaymentMethod(state, { payload }) {
      state.paymentMethod = payload;
    },
    setConfirmationEmail(state, { payload }) {
      state.confirmationEmail = payload;
    },
    resetCheckout(state) {
      state.step              = 1;
      state.selectedAddressId = null;
      state.buyNowItem        = null;
      state.paymentMethod     = 'COD';
      state.confirmationEmail = '';
      try { sessionStorage.removeItem('fk_buy_now'); } catch (_e) { /* sessionStorage unavailable */ }
    },
  },
});

export const {
  setStep, setSelectedAddress, setBuyNowItem,
  clearBuyNow, setPaymentMethod, setConfirmationEmail, resetCheckout,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
