export interface User{
  id:string,
  username?: string,
  role :'admin' | 'student',
  email :string,
  password?:string
}