import { useDispatch } from 'react-redux';
import { setStep } from '@/store/slices/checkoutSlice';
import styles from '../Checkout.module.css';

const STEPS = [
  { num: 1, label: 'ADDRESS' },
  { num: 2, label: 'ORDER SUMMARY' },
  { num: 3, label: 'PAYMENT' },
];

export default function StepIndicator({ currentStep }) {
  const dispatch = useDispatch();

  return (
    <div className={styles.stepBar}>
      {STEPS.map((s, i) => {
        const isDone   = currentStep > s.num;
        const isActive = currentStep === s.num;
        return (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center' }}>
            <div
              className={`${styles.stepItem} ${isActive ? styles.stepItemActive : ''} ${isDone ? styles.stepItemDone : ''}`}
              onClick={isDone ? () => dispatch(setStep(s.num)) : undefined}
            >
              <div className={`${styles.stepNum} ${isActive ? styles.stepNumActive : ''} ${isDone ? styles.stepNumDone : ''}`}>
                {isDone ? '✓' : s.num}
              </div>
              {s.label}
            </div>
            {i < STEPS.length - 1 && <span className={styles.stepArrow}>›</span>}
          </div>
        );
      })}
    </div>
  );
}
