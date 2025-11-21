const React = require('react');
module.exports = function MDEditor(props) {
  const { id, value, onChange, textareaProps = {} } = props;
  return React.createElement(
    'textarea',
    {
      id,
      'data-md-editor-stub': true,
      value: value || '',
      placeholder: textareaProps.placeholder || 'Pitch',
      onChange: (e) => onChange && onChange(e.target.value),
      style: { minHeight: 120 }
    }
  );
};
