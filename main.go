package main

import (
	"encoding/json"
	"fmt"
)

type T struct {
	Application struct {
		Architecture string `json:"architecture"`
		Environment  string `json:"environment"`
		Name         string `json:"name"`
		Version      string `json:"version"`
	} `json:"application"`
	CurrentState struct {
		Auth struct {
			AuthLoading bool `json:"authLoading"`
			Profile     struct {
				Email string `json:"email"`
				Name  string `json:"name"`
				Role  string `json:"role"`
			} `json:"profile"`
			User string `json:"user"`
		} `json:"auth"`
		DataConnections struct {
			FirestoreCollections []string `json:"firestore_collections"`
			RealtimeListeners    string   `json:"realtime_listeners"`
		} `json:"data_connections"`
		Navigation struct {
			ActiveTab          string `json:"activeTab"`
			HasCompletedSplash bool   `json:"hasCompletedSplash"`
			IsSidebarOpen      bool   `json:"isSidebarOpen"`
			ShowTutorial       bool   `json:"showTutorial"`
		} `json:"navigation"`
		Session struct {
			PossibleStatuses []string `json:"possible_statuses"`
			Status           string   `json:"status"`
		} `json:"session"`
	} `json:"current_state"`
	UiStructure struct {
		AdminViews []struct {
			Component   string `json:"component"`
			Description string `json:"description"`
			ID          string `json:"id"`
			Title       string `json:"title"`
		} `json:"admin_views"`
		ClientViews []struct {
			Component   string `json:"component"`
			Description string `json:"description"`
			ID          string `json:"id"`
			Title       string `json:"title"`
		} `json:"client_views"`
		LayoutComponents []struct {
			Name    string `json:"name"`
			Purpose string `json:"purpose"`
		} `json:"layout_components"`
		Theme struct {
			Colors struct {
				Accent     string `json:"accent"`
				Background string `json:"background"`
				Card       string `json:"card"`
				Text       string `json:"text"`
			} `json:"colors"`
			Mode       string `json:"mode"`
			Typography string `json:"typography"`
		} `json:"theme"`
	} `json:"ui_structure"`
}

func GetApplicationState() T {
	var state T

	state.Application.Name = "Véus de Mulambo"
	state.Application.Version = "1.0.0"
	state.Application.Architecture = "React 19 SPA + Vite + Tailwind CSS + Firebase Firestore"
	state.Application.Environment = "Cloud Run Sandbox"

	state.CurrentState.Auth.AuthLoading = false
	state.CurrentState.Auth.User = "usr_active_session"
	state.CurrentState.Auth.Profile.Name = "Kris Ty Oya"
	state.CurrentState.Auth.Profile.Email = "contacto@cartomantemulambo.pt"
	state.CurrentState.Auth.Profile.Role = "admin"

	state.CurrentState.DataConnections.FirestoreCollections = []string{
		"appointments",
		"posts",
		"trabalhos",
		"messages",
		"settings",
		"calls",
	}
	state.CurrentState.DataConnections.RealtimeListeners = "onSnapshot (Firestore)"

	state.CurrentState.Navigation.ActiveTab = "dashboard"
	state.CurrentState.Navigation.HasCompletedSplash = true
	state.CurrentState.Navigation.IsSidebarOpen = false
	state.CurrentState.Navigation.ShowTutorial = false

	state.CurrentState.Session.PossibleStatuses = []string{
		"idle",
		"payment_pending",
		"payment_sent",
		"mentor_received",
		"in_session",
		"session_completed",
	}
	state.CurrentState.Session.Status = "idle"

	state.UiStructure.AdminViews = []struct {
		Component   string `json:"component"`
		Description string `json:"description"`
		ID          string `json:"id"`
		Title       string `json:"title"`
	}{
		{ID: "perfil", Title: "Perfil & Biografia", Component: "AdminProfile", Description: "Edição de perfil, biografia, contactos e galeria"},
		{ID: "agenda", Title: "Agenda de Sessões", Component: "AdminAgenda", Description: "Gestão do calendário e sessões de atendimento"},
		{ID: "atendimento", Title: "Atendimento Live", Component: "AdminAttendance", Description: "Gestão de chamadas em direto e mensagens"},
		{ID: "trabalhos", Title: "Trabalhos Espirituais", Component: "AdminTrabalhos", Description: "Gestão de rituais e acompanhamentos oferecidos"},
		{ID: "galeria", Title: "Galeria & Feed", Component: "AdminGaleria", Description: "Publicação de conteúdos visuais e reels"},
		{ID: "carta_dia", Title: "Carta do Dia", Component: "AdminCartaDia", Description: "Configuração da mensagem e carta oracular diária"},
		{ID: "reflexoes", Title: "Reflexões", Component: "AdminReflexoes", Description: "Mensagens reflexivas para a comunidade"},
	}

	state.UiStructure.ClientViews = []struct {
		Component   string `json:"component"`
		Description string `json:"description"`
		ID          string `json:"id"`
		Title       string `json:"title"`
	}{
		{ID: "inicio", Title: "Início", Component: "IncioTab", Description: "Feed principal e destaques"},
		{ID: "trabalhos", Title: "Trabalhos", Component: "TrabalhosView", Description: "Lista de trabalhos espirituais e pedidos"},
		{ID: "carta", Title: "Carta do Dia", Component: "CartaDoDiaView", Description: "Revelação diária de oráculo"},
		{ID: "notificacoes", Title: "Notificações", Component: "NotificationsView", Description: "Central de alertas e atualizações"},
		{ID: "perfil", Title: "Perfil do Mentor", Component: "MentorProfileView", Description: "Detalhes e história da mentora"},
		{ID: "faq", Title: "Perguntas Frequentes", Component: "FaqView", Description: "Respostas a dúvidas frequentes"},
	}

	state.UiStructure.LayoutComponents = []struct {
		Name    string `json:"name"`
		Purpose string `json:"purpose"`
	}{
		{Name: "BottomNav", Purpose: "Navegação inferior mobile"},
		{Name: "Sidebar", Purpose: "Menu de navegação lateral"},
		{Name: "CallInterface", Purpose: "Interface de videochamada e sessão ao vivo"},
		{Name: "ThemeSwitcher", Purpose: "Alternador de modo visual"},
		{Name: "ParticlesBackground", Purpose: "Fundo com efeito visual de partículas"},
	}

	state.UiStructure.Theme.Colors.Accent = "gold (#D4AF37)"
	state.UiStructure.Theme.Colors.Background = "dark (#0D071C)"
	state.UiStructure.Theme.Colors.Card = "panel (#1A122C)"
	state.UiStructure.Theme.Colors.Text = "cream (#FDFBF7)"
	state.UiStructure.Theme.Mode = "mystic-dark"
	state.UiStructure.Theme.Typography = "Playfair Display + Plus Jakarta Sans"

	return state
}

func main() {
	state := GetApplicationState()
	bytes, err := json.MarshalIndent(state, "", "  ")
	if err != nil {
		fmt.Println("Error marshalling json:", err)
		return
	}
	fmt.Println(string(bytes))
}
