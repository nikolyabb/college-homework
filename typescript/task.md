Создайте класс User и его наследника класс SuperUser, которые описывают пользователя и супер-пользователя.

В классе User необходимо описать:

конструктор, который принимает в качестве параметров значения для атрибутов name, login и passwordсвойства (геттеры и сеттеры) для изменения и получения значений атрибутовметод showInfo, который печатает в произвольном формате значения атрибутов name и loginстатическое поле класса count для хранения количества созданных экземпляров класса User

Необходимые условия, которые надо учесть:

атрибут name доступен и для чтения, и для измененияатрибут login доступен только для чтенияатрибут password доступен только для изменения

В классе SuperUser необходимо описать:

конструктор, который принимает в качестве параметров значения для атрибутов name, login, password и roleсвойство для изменения и получения значения атрибута roleметод showInfo, который печатает в произвольном формате значения атрибутов name, login и roleстатическое поле класса count для хранения количества созданных экземпляров класса SuperUser

Как это должно работать:

Тест 1:
```
const user1 = new User('Paul McCartney', 'paul', '1234')
const user2 = new User('George Harrison', 'george', '5678')
const user3 = new User('Richard Starkey', 'ringo', '8523')
const admin = new SuperUser('John Lennon', 'john', '0000', 'admin')

user1.showInfo()
admin.showInfo()
```

Вывод теста 1:
```
Name: Paul McCartney, Login: paul
Name: John Lennon, Login: john, Role: admin
```

Тест 2:
```
let users = User.count
let admins = SuperUser.count

console.log(`Всего обычных пользователей: ${users}`)
console.log(`Всего супер-пользователей: ${admins}`)
```

Вывод теста 2:
```
Всего обычных пользователей: 3
Всего супер-пользователей: 1
```

Тест 3:
```
user3.name = 'Ringo Star'
user1.password = 'Pa$$w0rd'
console.log(user3.name)
console.log(user2.password)
console.log(user2.login)
user2.login = 'geo'
```

Вывод теста 3:
```
Ringo Starr
********
george
Ошибка: нельзя изменять логин
```
