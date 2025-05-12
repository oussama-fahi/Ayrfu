package com.uddan.ayrfu.service.impl;

import com.uddan.ayrfu.dto.request.ClientRequest;
import com.uddan.ayrfu.dto.response.ClientResponse;
import com.uddan.ayrfu.entity.Client;
import com.uddan.ayrfu.exception.BadRequestException;
import com.uddan.ayrfu.exception.ResourceNotFoundException;
import com.uddan.ayrfu.repository.ClientRepository;
import com.uddan.ayrfu.service.ClientService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClientServiceImpl implements ClientService {

    private static final Logger logger = LoggerFactory.getLogger(ClientServiceImpl.class);
    private final ClientRepository clientRepository;

    public ClientServiceImpl(ClientRepository clientRepository) {
        this.clientRepository = clientRepository;
    }

    @Override
    @Transactional
    public ClientResponse createClient(ClientRequest clientRequest) {
        logger.info("Creating new client with email: {}", clientRequest.getEmail());

        // Check if client with email already exists
        if (clientRepository.existsByEmail(clientRequest.getEmail())) {
            throw new BadRequestException("Client with email " + clientRequest.getEmail() + " already exists");
        }

        Client client = Client.builder()
                .companyName(clientRequest.getCompanyName())
                .contactPerson(clientRequest.getContactPerson())
                .email(clientRequest.getEmail())
                .phoneNumber(clientRequest.getPhoneNumber())
                .industry(clientRequest.getIndustry())
                .companySize(clientRequest.getCompanySize())
                .requirements(clientRequest.getRequirements())
                .build();

        Client savedClient = clientRepository.save(client);
        logger.info("Client created with ID: {}", savedClient.getId());

        return mapToClientResponse(savedClient);
    }

    @Override
    @Transactional(readOnly = true)
    public ClientResponse getClientById(Long id) {
        logger.info("Fetching client with ID: {}", id);

        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with ID: " + id));

        return mapToClientResponse(client);
    }

    @Override
    @Transactional(readOnly = true)
    public ClientResponse getClientByEmail(String email) {
        logger.info("Fetching client with email: {}", email);

        Client client = clientRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with email: " + email));

        return mapToClientResponse(client);
    }

    @Override
    @Transactional(readOnly = true)
    public List<ClientResponse> getAllClients(int page, int size) {
        logger.info("Fetching all clients, page: {}, size: {}", page, size);

        Pageable pageable = PageRequest.of(page, size);
        Page<Client> clients = clientRepository.findAll(pageable);

        return clients.getContent().stream()
                .map(this::mapToClientResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ClientResponse updateClient(Long id, ClientRequest clientRequest) {
        logger.info("Updating client with ID: {}", id);

        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with ID: " + id));

        // Check if email is being changed and if the new email is already in use
        if (!client.getEmail().equals(clientRequest.getEmail()) &&
                clientRepository.existsByEmail(clientRequest.getEmail())) {
            throw new BadRequestException("Email " + clientRequest.getEmail() + " is already in use");
        }

        client.setCompanyName(clientRequest.getCompanyName());
        client.setContactPerson(clientRequest.getContactPerson());
        client.setEmail(clientRequest.getEmail());
        client.setPhoneNumber(clientRequest.getPhoneNumber());
        client.setIndustry(clientRequest.getIndustry());
        client.setCompanySize(clientRequest.getCompanySize());
        client.setRequirements(clientRequest.getRequirements());

        Client updatedClient = clientRepository.save(client);
        logger.info("Client updated with ID: {}", updatedClient.getId());

        return mapToClientResponse(updatedClient);
    }

    @Override
    @Transactional
    public void deleteClient(Long id) {
        logger.info("Deleting client with ID: {}", id);

        Client client = clientRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with ID: " + id));

        clientRepository.delete(client);

        logger.info("Client deleted with ID: {}", id);
    }

    @Override
    public boolean isOwnProfile(Long clientId, Long userId) {
        Client client = clientRepository.findById(clientId)
                .orElseThrow(() -> new ResourceNotFoundException("Client not found with ID: " + clientId));

        return client.getUser() != null && client.getUser().getId().equals(userId);
    }

    @Override
    public boolean isOwnEmail(String email, String userEmail) {
        return email.equals(userEmail);
    }

    /**
     * Maps a Client entity to a ClientResponse DTO
     */
    private ClientResponse mapToClientResponse(Client client) {
        return ClientResponse.builder()
                .id(client.getId())
                .companyName(client.getCompanyName())
                .contactPerson(client.getContactPerson())
                .email(client.getEmail())
                .phoneNumber(client.getPhoneNumber())
                .industry(client.getIndustry())
                .companySize(client.getCompanySize())
                .requirements(client.getRequirements())
                .createdAt(client.getCreatedAt())
                .updatedAt(client.getUpdatedAt())
                .build();
    }
}