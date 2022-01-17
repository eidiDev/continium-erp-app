import antdEn from "antd/lib/locale-provider/pt_BR";
import appLocaleData from "react-intl/locale-data/br";
import enMessages from "../locales/pt_BR.json";

const brLang = {
  messages: {
    ...enMessages
  },
  antd: antdEn,
  locale: 'br',
  data: appLocaleData
};
export default brLang;
