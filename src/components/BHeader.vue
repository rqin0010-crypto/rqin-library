<template>
  <div class="container">
    <header class="d-flex justify-content-center py-3">
      <ul class="nav nav-pills">

        <li class="nav-item">
          <RouterLink
            to="/"
            class="nav-link"
            active-class="active"
          >
            Home
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/about"
            class="nav-link"
            active-class="active"
          >
            About
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/FireLogin"
            class="nav-link"
            active-class="active"
          >
            Firebase Login
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/FireRegister"
            class="nav-link"
            active-class="active"
          >
            Firebase Register
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/FireLogout"
            class="nav-link"
            active-class="active"
          >
            Firebase Logout
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/addbook"
            class="nav-link"
            active-class="active"
          >
            Add Book
          </RouterLink>
        </li>

        <li class="nav-item">
          <RouterLink
            to="/getbookcount"
            class="nav-link"
            active-class="active"
          >
            Get Book Count
          </RouterLink>
        </li>

      </ul>
    </header>
  </div>
</template>