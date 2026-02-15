import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { grey } from '@mui/material/colors';
import AccountBalanceWalletOutlined from '@mui/icons-material/AccountBalanceWalletOutlined';
import CreditCardOutlined from '@mui/icons-material/CreditCardOutlined';
import QrCode2Outlined from '@mui/icons-material/QrCode2Outlined';
import AccountBalanceOutlined from '@mui/icons-material/AccountBalanceOutlined';
import PhoneAndroidOutlined from '@mui/icons-material/PhoneAndroidOutlined';

/** UI value -> Razorpay method */
export const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', icon: PhoneAndroidOutlined, razorpayMethod: 'upi' },
  { id: 'qr', label: 'QR Code', icon: QrCode2Outlined, razorpayMethod: 'upi' },
  { id: 'card', label: 'Card', icon: CreditCardOutlined, razorpayMethod: 'card' },
  { id: 'netbanking', label: 'Net Banking', icon: AccountBalanceOutlined, razorpayMethod: 'netbanking' },
  { id: 'wallet', label: 'Wallets', icon: AccountBalanceWalletOutlined, razorpayMethod: 'wallet' },
];

/**
 * Selectable payment method tiles. One selected at a time.
 * value: id (e.g. 'upi'), onChange(id), disabled
 */
export function PaymentMethodSelector({ value, onChange, disabled = false }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
      <Typography variant="subtitle2" fontWeight={600} color="grey.800" sx={{ mb: 0.5 }}>
        Payment method
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))',
          gap: 1,
        }}
      >
        {PAYMENT_METHODS.map((method) => {
          const Icon = method.icon;
          const selected = value === method.id;
          return (
            <Box
              key={method.id}
              onClick={() => !disabled && onChange(method.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
                  e.preventDefault();
                  onChange(method.id);
                }
              }}
              aria-pressed={selected}
              aria-label={`Select ${method.label}`}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                py: 1.5,
                px: 1,
                borderRadius: 1.5,
                border: '2px solid',
                borderColor: selected ? 'primary.main' : grey[300],
                bgcolor: selected ? 'primary.light' : grey[50],
                color: selected ? 'primary.dark' : grey[700],
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.7 : 1,
                transition: 'border-color 0.2s, background-color 0.2s, color 0.2s',
                '&:hover': disabled
                  ? {}
                  : {
                      borderColor: selected ? 'primary.main' : grey[400],
                      bgcolor: selected ? 'primary.light' : grey[100],
                    },
              }}
            >
              <Icon sx={{ fontSize: 24, mb: 0.5 }} />
              <Typography variant="caption" fontWeight={600} sx={{ textAlign: 'center' }}>
                {method.label}
              </Typography>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}

export default PaymentMethodSelector;
