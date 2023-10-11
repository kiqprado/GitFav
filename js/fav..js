import { GitHubUser } from './GitHub.js'

class gitFav {
  constructor(root) {
    this.root = document.querySelector(root)

    this.load()
  }

  load() {
    this.users = JSON.parse(localStorage.getItem('@git-fav')) || []
  }

  save() {
    localStorage.setItem('@git-fav', JSON.stringify(this.users))
  }

  async add(username) {
    try {
      const userExist = this.users.find(user => user.login === username)

      if (userExist) {
        throw new Error('Usuário já cadasdrado.')
      }

      const user = await GitHubUser.search(username)

      if (user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.users = [user, ...this.users]
      this.update()
      this.save()
    } catch (error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredUsers = this.users.filter(entry => entry.login !== user.login)

    this.users = filteredUsers
    this.update()
    this.save()
  }
}

export class favViews extends gitFav {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onAdd()
  }

  onAdd() {
    const addBtn = this.root.querySelector('#fav')
    addBtn.onclick = () => {
      const { value } = this.root.querySelector('#search')
      this.add(value)
    }
  }

  update() {
    this.removeAllTr()

    if (this.users.length === 0) {
      const defaultRow = this.createDefaultRow()
      this.tbody.append(defaultRow)
    } else {
      this.users.forEach(user => {
        const row = this.createRow()

        row.querySelector(
          '.user img'
        ).src = `https://github.com/${user.login}.png`
        row.querySelector('.user img').alt = `Imagem de ${user.name}`

        row.querySelector('.user a').href = `https://github.com/${user.login}`
        row.querySelector('.user p').textContent = user.name
        row.querySelector('.user span').textContent = `/${user.login}`

        row.querySelector('.repositories').textContent = user.public_repos

        row.querySelector('.followers').textContent = user.followers

        row.querySelector('#remove').onclick = () => {
          const isDelete = confirm('Deseja remover este usuário?')

          if (isDelete) {
            this.delete(user)
          }
        }

        this.tbody.append(row)
      })
    }
  }

  createDefaultRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td colspan="4" class="defaultRow">
    <div class="defaultContent">
    <img src="./assets/Star.svg">Nenhum favorito ainda
    </div>
    </td>
    `

    return tr
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
    <td class="user flex">
    <img src="" alt="" />
    <a href="" target="_blank">
      <p></p>
      <span></span>
    </a>
    </td>
    <td class="repositories"></td>
    <td class="followers"></td>
    <td class="action"><button id="remove">Remover</button></td>
    `

    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach(tr => {
      tr.remove()
    })
  }
}
