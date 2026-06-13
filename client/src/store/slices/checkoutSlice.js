import { createSlice } from '@reduxjs/toolkit';

const checkoutSlice = createSlice({
  name: 'checkout',
  initialState: {
    step:               1,
    selectedAddressId:  null,
    buyNowItem:         null,
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
    },
    clearBuyNow(state) {
      state.buyNowItem = null;
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
    },
  },
});

export const {
  setStep, setSelectedAddress, setBuyNowItem,
  clearBuyNow, setPaymentMethod, setConfirmationEmail, resetCheckout,
} = checkoutSlice.actions;
export default checkoutSlice.reducer;
