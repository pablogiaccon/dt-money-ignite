import logo from '../../assets/logo.svg';
import { Wrapper, Container } from './styles';

export function Header() {
  return (
    <Wrapper>
      <Container>
        <img src={logo} alt="dt money" />

        <button type="button">Nova transação</button>
      </Container>
    </Wrapper>
  );
}
