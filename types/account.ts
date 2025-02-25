export enum AccountTypeEnum {
  LDAP = "LDAP",
  LOCAL = "local",
}

export interface Tag {
  text: string;
}

export interface Account {
  id: string;
  tags: Tag[];
  accountType: AccountTypeEnum;
  login: string | null;
  password: string | null;
}
