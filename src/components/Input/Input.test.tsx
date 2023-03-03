import { fireEvent, render, screen } from '@testing-library/react';
import Input from './Input';

describe('<Input />', () => {

    it('should render Input with correct type and title', () => {
      const type = 'text';
      const title = 'Name';
      const error = undefined;
      const register = undefined;
      render(<Input type={type} title={title} error={error} register={register}></Input>);

      expect(document.querySelector('.input-div')).toBeInTheDocument();
      expect(screen.getByText(title)).toBeInTheDocument();

      expect(document.querySelector('.error-p')).toBeEmptyDOMElement();
    });

    it('should call onChangeFunction when input value changes', () => {
      const type = 'text';
      const title = 'Name';
      const error = undefined;
      const register = undefined;
      const onChangeFunction = jest.fn();
      render(<Input type={type} title={title} error={error} register={register} onChangeFunction={onChangeFunction}></Input>);

      const inputElement = screen.getByRole('textbox');
      const inputValue = 'test';
      fireEvent.change(inputElement, { target: { value: inputValue} });

      expect(onChangeFunction).toHaveBeenCalledTimes(1);
      expect(onChangeFunction).toHaveBeenCalledWith(inputValue);
    });

    it('should call display error when there is an error', () => {
      const type = 'text';
      const title = 'Name';
      const error = 'error';
      const register = undefined;
      const onChangeFunction = jest.fn();
      render(<Input type={type} title={title} error={error} register={register} onChangeFunction={onChangeFunction}></Input>);

      expect(document.querySelector('.error-p')).toHaveTextContent('error');
    });


});