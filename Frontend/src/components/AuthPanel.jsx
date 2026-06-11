import { useState } from 'react';
import { Alert, Button, Stack, Tab, Tabs, TextField, Typography } from '@mui/material';
import { supabase } from '../SupabaseClient';

function AuthPanel({ onAuthChange }) {
  // 로그인/회원가입 탭
  const [mode, setMode] = useState('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState('info');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const resetMessage = () => {
    setMessage('');
    setSeverity('info');
  };

  const validateBaseFields = () => {
    // 빈 값이면 요청 보내기 전에 막기
    if (!email.trim()) {
      setSeverity('warning');
      setMessage('이메일을 입력해주세요.');
      return false;
    }

    if (!password) {
      setSeverity('warning');
      setMessage('비밀번호를 입력해주세요.');
      return false;
    }

    return true;
  };

  const signUp = async () => {
    if (!validateBaseFields()) return;

    if (password !== confirmPassword) {
      setSeverity('warning');
      setMessage('비밀번호 확인이 일치하지 않습니다.');
      return;
    }

    setIsSubmitting(true);
    // Supabase 회원가입
    const { data, error } = await supabase.auth.signUp({ email: email.trim(), password });
    setIsSubmitting(false);

    if (error) {
      setSeverity('error');
      setMessage(error.message);
      return;
    }

    setSeverity('success');
    setMessage('회원가입이 완료되었습니다.');
    onAuthChange?.(data.user);
  };

  const signIn = async () => {
    if (!validateBaseFields()) return;

    setIsSubmitting(true);
    // Supabase 로그인
    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setIsSubmitting(false);

    if (error) {
      setSeverity('error');
      setMessage(error.message);
      return;
    }

    setSeverity('success');
    setMessage('로그인되었습니다.');
    onAuthChange?.(data.user);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (isSubmitting) return;

    // Enter 누르면 현재 탭 실행
    if (mode === 'signin') {
      signIn();
      return;
    }

    signUp();
  };

  return (
    <Stack component="form" spacing={2} onSubmit={handleSubmit}>
      <Typography variant="h6">
        {mode === 'signin' ? '로그인' : '회원가입'}
      </Typography>

      <Tabs
        value={mode}
        onChange={(_event, value) => {
          setMode(value);
          setConfirmPassword('');
          resetMessage();
        }}
      >
        <Tab label="로그인" value="signin" />
        <Tab label="회원가입" value="signup" />
      </Tabs>

      <TextField
        label="이메일"
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          resetMessage();
        }}
      />
      <TextField
        label="비밀번호"
        type="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          resetMessage();
        }}
      />

      {mode === 'signup' && (
        <TextField
          label="비밀번호 확인"
          type="password"
          value={confirmPassword}
          onChange={(e) => {
            setConfirmPassword(e.target.value);
            resetMessage();
          }}
        />
      )}

      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitting}
      >
        {mode === 'signin' ? '로그인' : '회원가입'}
      </Button>

      {message && <Alert severity={severity}>{message}</Alert>}
    </Stack>
  );
}

export default AuthPanel;
